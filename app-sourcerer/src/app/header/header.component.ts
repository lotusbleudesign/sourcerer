import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  viewer:
    | {
      login: string;
      bio: string;
      name: string;
      avatarUrl: string;
      location: string;
      followers: { totalCount: number };
      following: { totalCount: number };
      repositories: {
        totalCount: number;
        nodes: [
          {
            name: string;
            description: string;
            createdAt: string;
            updatedAt: Date;
            primaryLanguage: {
              name: string;
              color: string;
            }
            languages: {
              edges: [
                {
                  size: number
                  node: {
                    name: string,
                    color: string
                  }
                }
              ]
            };
            collaborators: {
              nodes: [
                {
                  name: string;
                  login: string;
                  avatarUrl: string;
                }

              ];
              totalCount: number;
            };
            refs: {
              edges: [
                {
                  node: {
                    name: string;
                    target: {
                      history: {
                        totalCount: number;
                      };
                    };
                  };
                }
              ];
            };
            object: {
              entries: [
                {
                  name: string;
                  type: string;
                  object: {
                    entries: [
                      {
                        name: string;
                        type: string;
                        object: {
                          byteSize: number;
                          text: string;
                        };
                      }
                    ];
                  };
                }
              ];
            };
            nbCommitPerRepo: number
            nbCodeLinesPerRepo: number
          }
        ]
      }
      totalCommitCount: number
      totalCodeLinesCount: number
      updateDate: Date
      nameRepo: string
      chartData: any[]
    }
    | undefined;
  loading = true;
  error: any;

  constructor(private apollo: Apollo) { }

  countTreeCodeLines(entries: any) {
    let nbCodeLines = 0

    for (let item of entries) {
      if (item?.type === 'tree' && item?.object?.entries) {
        nbCodeLines += this.countTreeCodeLines(item?.object?.entries)
      } else {
        let text = item?.object?.text
        if (text) {
          nbCodeLines += (text.match(/\n/g) || []).length // Notation match() : soit on compte le nombre de ligne, soit on retourne un tableau vide
        }
      }
    }
    return nbCodeLines
  }

  ngOnInit() {

    this.apollo
      .watchQuery({
        query: gql`
          query {
            viewer {
              login
              bio
              name
              avatarUrl
              location
              followers(first: 50) {
                totalCount
              }
              following(first: 50) {
                totalCount
              }
              repositories(first: 50, isFork:false) {
                totalCount
                nodes {
                  name
                  description
                  createdAt
                  updatedAt
                  primaryLanguage {
                    name
                    color
                  }
                  languages(first: 10) {
                    edges {
                      size
                      node {
                        name
                        color
                      }
                    }
                  }
                  collaborators(affiliation: ALL) {
                    nodes {
                      name
                      login
                      avatarUrl
                    }
                  totalCount
                  }
                  refs(first: 40, refPrefix: "refs/heads/") {
                    edges {
                      node {
                        ...branch
                      }
                    }
                    totalCount
                  }
                  object(expression: "HEAD:") {
                    ... on Tree {
                      entries {
                        name
                        type
                        object {
                          ... on Blob {
                            byteSize
                            text
                          }
                          ... on Tree {
                            entries {
                              name
                              type
                              object {
                                ... on Blob {
                                  byteSize
                                  text
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          fragment branch on Ref {
            name
            target {
              ... on Commit {
                history(first: 0) {
                  totalCount
                }
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.loading = result.loading;
        this.error = result.error;
        this.viewer = result?.data?.viewer;

        // On clone la reponse qui est un objet non extensible de façon à pouvoir completer les données
        this.viewer = JSON.parse(JSON.stringify(this.viewer))

        let nodes = this.viewer?.repositories?.nodes

        if (!this.viewer || !nodes) {
          return
        }
        this.viewer.totalCommitCount = 0
        this.viewer.totalCodeLinesCount = 0
        this.viewer.chartData = []
        let chartDataTmp: any = {}

        for (let node of nodes) {
          // On décompte le nombre total de commit à partir de repository (si present)
          if (node) {
            this.viewer.updateDate = node?.updatedAt
            node.nbCommitPerRepo = 0

            for (let item of node?.refs?.edges) {
              node.nbCommitPerRepo += item?.node?.target?.history?.totalCount
            }
            this.viewer.totalCommitCount += node.nbCommitPerRepo;

            node.nbCodeLinesPerRepo = 0
            if (node?.object?.entries) {
              node.nbCodeLinesPerRepo = this.countTreeCodeLines(node?.object?.entries)
            }
            this.viewer.totalCodeLinesCount += node.nbCodeLinesPerRepo

            for (let lang of node?.languages?.edges) {

              if (!chartDataTmp[lang.node.name]) {
                chartDataTmp[lang.node.name] = []
              }

              chartDataTmp[lang.node.name].push(
                {
                  name: node.createdAt,
                  value: lang.size
                }
              )

            }
            for (let langName in chartDataTmp) {
              this.viewer.chartData.push({
                name: langName,
                series: chartDataTmp[langName]
              })
            }
          }
        }
      });
  }
}
