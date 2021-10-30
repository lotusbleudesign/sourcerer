import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'exchange-rates',
  templateUrl: './exchange-rates.component.html'
})
export class ExchangeRates implements OnInit {
  viewer: { login: string, bio: string } | undefined;
  loading = true;
  error: any;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          query {
            viewer {
            login
            bio
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.viewer = result?.data?.viewer;
        this.loading = result.loading;
        this.error = result.error;
      });
  }
}
