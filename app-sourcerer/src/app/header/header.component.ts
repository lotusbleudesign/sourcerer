import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  //## ------ CHART 1
  data: any[] = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ];
  onSelect(event: any) {
    console.log(event);
  }
  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  // ----- SCHEMA
  viewer:
    | {
      login: string;
      bio: string;
      name: string;
      avatarUrl: string;
      followers: { totalCount: number };
      following: { totalCount: number };
      repositories: {
        nodes: [
          {
            name: string,
            languages: {
              nodes: [{ name: string; color: string }];
              totalCount: number;
              totalSize: number;
            };
          }
        ];
        totalCount: number;
        edges: [{
          node: {
            refs: {
              edges: [{
                node: {
                  target: { history: { totalCount: number } };
                };
              }];
            };
          };
        }];
      };

      totalCommitCount: number;

    }
    | undefined;

  loading = true;
  error: any;

  constructor(private apollo: Apollo) {

  }

  // ---- Hook Cycle
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
              followers(first: 50) {
                totalCount
              }
              following(first: 50) {
                totalCount
              }
              repositories(last: 50) {
                nodes {
                  name
                  languages(last: 30) {
                    nodes {
                      name
                      color
                    }
                    totalCount
                    totalSize
                  }
                }
                totalCount
                edges {
                  node {
                    name
                    refs(first: 30, refPrefix: "refs/heads/") {
                      edges {
                        node {
                          ...branch
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


        // --- totalCommitCount
        // ? permet de spécifier qu'il peut être nul, sinon erreur
        let totalCommitCount = 0;
        let repos = this.viewer?.repositories?.edges;

        // On décompte le nombre total de commit à partir de repository (si present)
        if (repos) {
          for (let item of repos) {
            for (let subItem of item?.node?.refs?.edges) {
              totalCommitCount += subItem?.node?.target?.history?.totalCount
            }
          }
        }
        // On fusionne un un object contenant totalCommitCount avec this.viewer (result?.data?.viewer qui de base non modifiable)
        this.viewer = Object.assign(
          { totalCommitCount: totalCommitCount },
          this.viewer
        );
      });
  }
}
