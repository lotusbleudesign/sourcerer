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
      avatarUrl: string;
      name: string;
      repositories: {
        totalCount: number,
        edges: [{ node: { name: string } }]
      };
      followers: { totalCount: number };
      following: { totalCount: number };
      totalCommitCount: number;
    }
    | undefined;

  loading = true;
  error: any;

  constructor(private apollo: Apollo) { }
  //##--  sur le compte github :
  //Lines de code
  // Refresh ??
  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          query {
            viewer {
              login
              name
              avatarUrl
              repositories(last: 50) {
                edges {
                  node {
                    name
                  }
                }
                totalCount
              }
              followers(first: 10) {
                totalCount
              }
              following(first: 10) {
                totalCount
              }
            }
            repository(owner: "lotusbleudesign", name: "learn.graphql") {
              refs(
                refPrefix: "refs/heads/"
                orderBy: { direction: DESC, field: TAG_COMMIT_DATE }
                first: 100
              ) {
                edges {
                  node {
                    ... on Ref {
                      name
                      target {
                        ... on Commit {
                          history(first: 0) {
                            totalCount
                          }
                        }
                      }
                    }
                  }
                }
                totalCount
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.loading = result.loading;
        this.error = result.error;
        this.viewer = result?.data?.viewer;

        // On décompte le nombre total de commit à partir de repository (si present)
        let totalCommitCount = 0;
        let repos = result?.data?.repository?.refs?.edges;

        if (repos) {
          for (let repo of repos) {
            totalCommitCount += repo?.node?.target?.history?.totalCount; // on incrémenter le total
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
