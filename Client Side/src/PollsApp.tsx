import React, { Component } from "react";
import { PollList } from "./PollList";
import { NewPoll } from "./NewPoll";
import { PollDetails } from "./PollDetails";

type Page = "list" | "new" | {kind: "poll", name: string};

type PollsAppState = {page: Page};

const DEBUG: boolean = true;

/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {page: "list"};
  }

  //Renders the page depending on it's state 
  render = (): JSX.Element => {
    if(this.state.page === "list") {
      if(DEBUG) console.debug("rendering list page");
      return <PollList onNewClick={this.doNewClick} onPollClick={this.doPollClick}/>;
    } else if(this.state.page === "new") {
      if(DEBUG) console.debug("rendering list page");
      return <NewPoll onBackClick={this.doBackClick}/>;
    } else { //poll details
      if(DEBUG) console.debug("rendering list page");
      return <PollDetails name={this.state.page.name} onBackClick={this.doBackClick}/>
    }
  };

  //State is set to "new" when "New" button is clicked
  doNewClick = (): void => {
    if (DEBUG) console.debug("set state to new");
    this.setState({page: "new"});
  };

  //State is set to "poll" when the poll is clicked 
  doPollClick = (name: string): void => {
    if (DEBUG) console.debug(`set state to details for auction ${name}`);
    this.setState({page: {kind: "poll", name}});
  };

  //State is set to "list" or main
  doBackClick = (): void => {
    if(DEBUG) console.debug("set state to list");
    this.setState({page: "list"});
  };

}
