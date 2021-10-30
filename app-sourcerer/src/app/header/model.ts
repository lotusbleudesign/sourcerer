
// Ressources  

// Commande pour lister mes éléments de mon compte github
// curl - i "https://api.github.com/users/lotusbleudesign/repos?type=owner"

/*  https://stackoverflow.com/questions/41907903/cloning-objects-typescript

Object.assign()
utilisée afin de copier les valeurs de toutes les propriétés directes (non héritées) d'un objet qui sont énumérables sur un autre objet cible. Cette méthode renvoie l'objet cible.
*/

/*

{
  repository(owner: "lotusbleudesign", name: "learn.graphql") {
    refs(refPrefix: "refs/heads/", orderBy: { direction: DESC, field: TAG_COMMIT_DATE }, first: 100) {
      edges {
        node {
          ... on Ref {
            name
            target {
              ... on Commit {
                committedDate
                history(first: 10) {
                  edges {
                    node {
                      ... on Commit {
                        id
                        committedDate
                        committer {
                          name
                        }
                      }
                    }
                  }
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

{
  viewer {
    login
    name
    avatarUrl
    repositories {
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
    defaultBranchRef {
      ... on Ref {
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
}
*/

/*
{
  viewer {
    login
    repositories(first:50){
      nodes{
        name
        primaryLanguage{
          name
          color
        }
      }
      totalCount
    }
  }
}

*/


//langage et couleur par repo , date update, date création, description,
/*
{
  viewer {
    login
    createdAt
    updatedAt
    repositories(first: 50) {
      nodes {
        name
        languages(last: 10) {
          nodes {
            name
            color
          }
          totalSize
        }
        description
      }
      totalCount
    }
  }
}

*/

// refs(refPrefix: "refs/heads/") {
//   edges {
//     node {
//       target {
//         ... on Commit {
//           history(first: 0) {
//             totalCount
//           }
//         }
//       }
//     }
//   }
// }

// {
//   repository(owner: "facebook", name: "react") {
  //   object(expression: "master") {
  //     ... on Commit {
  //       history {
  //         nodes {
  //           committedDate
  //         }

  //       }
  //     }
  //   }
  // }
// }