
// Ressources  

// Commande pour lister mes éléments de mon compte github
// curl - i "https://api.github.com/users/lotusbleudesign/repos?type=owner"

/*  https://stackoverflow.com/questions/41907903/cloning-objects-typescript

Object.assign()
utilisée afin de copier les valeurs de toutes les propriétés directes (non héritées) d'un objet qui sont énumérables sur un autre objet cible. Cette méthode renvoie l'objet cible.
*/

/*
query {
 user(login: "lotusbleudesign") {
   name
  login
 }
}

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

//


// TEST SUR LE REPO
// {
//   repository(owner: "lotusbleudesign", name: "J2EE-JPA") {
//     refs(refPrefix: "refs/heads/", orderBy: { direction: DESC, field: TAG_COMMIT_DATE }, first: 100) {
//       edges {
//         node {
//           ... on Ref {
//             name
//             target {
//               ... on Commit {
//                 history(first: 0) {
//                   totalCount
//                 }
//               }
//             }
//           }
//         }
//       }
//       totalCount
//     }
//     languages(first: 10) {
//       edges {
//         size
//         node {
//           name
//           color
//         }
//       }
//     }
//   }
// }

//name: "J2EE-JPA"

// ######### RECENT 
//langage et couleur par repo , date update, date création, description, nombre de commit
/*
{
  viewer {
    login
    createdAt
    updatedAt
    repositories(first: 50) {
      nodes {
        name
        description
        object(expression: "main") {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
        languages(last: 50) {
          edges {
            node {
              name
              color
            }
            size
          }
        }

      }
      totalCount
    }
  }
}

// */
// {
//   viewer {
//     login
//     name
//     avatarUrl
//     followers(first: 10) {
//       totalCount
//     }
//     following(first: 10) {
//       totalCount
//     }
//     repositories(last: 50) {
//       nodes {
//         name
//         languages(last: 20) {
//           nodes {
//             name
//             color
//           }
//           totalCount
//           totalSize
//         }
//       }
//       edges {
//         node {
//           name
//           refs(first: 10, refPrefix: "refs/heads/") {
//             edges {
//               node {
//                 ...branch
//               }
//             }
//           }
//         }
//       }
//       totalCount
//     }
//   }
// }

// fragment branch on Ref {
//   name
//   target {
//     ... on Commit {
//       history(first: 0) {
//         totalCount
//       }
//     }
//   }
// }

// <!-- < ul >
//   <li * ngFor="let item of viewer?.repositories?.edges" >
//     <ul>
//     <li * ngFor="let subItem of item?.node?.refs?.edges" >
//       & nbsp;& nbsp; { { subItem?.node?.target?.history?.totalCount } }
// </li>
//   < /ul>
//   < /li>
//   < /ul> -->


// FINAL 
{
  user(login: "lotusbleudesign") {
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
    repositories(first: 5) {
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


// count git ls-files | xargs cat | wc -l

https://api.github.com/repos/lotusbleudesign/<repo_name/commits?page=0&per_page=30
// curl - H "Authorization: bearer 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" https://api.github.com/graphql