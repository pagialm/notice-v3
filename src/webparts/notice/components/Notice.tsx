import * as React from "react";
import styles from "./Notice.module.scss";
import { INoticeProps } from "./INoticeProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { INoticeWebPartProps } from "../NoticeWebPart";
import NoticeDialog from "./NoticeDialog";
// import { autobind } from "office-ui-fabric-react";
import { SPHttpClient } from "@microsoft/sp-http";

const _NOTICEBOARD: string = "Notice Board";

export interface INoticeState {
  isModalOpen: boolean;
  item?: any;
  imgUrl?: string;
  Link?: string;
  title?: string;
  subTitle?: string;
  description?: string;
}

export default class Notice extends React.Component<
  INoticeWebPartProps,
  INoticeState
> {
  constructor(props: INoticeWebPartProps, state: INoticeState) {
    super(props);
    this.state = {
      isModalOpen: false,
      item: undefined,
      imgUrl: "",
      Link: "",
      title: "",
      subTitle: "",
      description: "",
    };
    this._HideModal = this._HideModal.bind(this);
  }
  // @autobind
  private _HideModal(): void {
    this.setState({ isModalOpen: false });
  }
  public async componentDidMount(): Promise<void> {
    console.log("ssssss...");
    this._GetSPItems(_NOTICEBOARD).then((notices) => {
      if (notices && notices.length > 0) {
        notices.forEach((notice) => {
          console.log(notice);
          const imgObj = JSON.parse(notice.Image);
          this.setState({
            imgUrl: `${imgObj.serverUrl}${imgObj.serverRelativeUrl}`,
            Link: `${notice.Link}`,
            title: notice.Title,
          });
          this.setState({ isModalOpen: true });
        });
      } else {
        if (!notices)
          this.setState({
            item: "Notice list not found, contact the administrator.",
          });
        else console.log("No notices found.");
      }
    });
  }
  // @autobind
  private _GetSPItems(listname: string): Promise<any[]> {
    const url =
      this.props.context.pageContext.site.absoluteUrl +
      "/_api/lists/getByTitle('" +
      listname +
      "')/items?State='Active'";
    return this.props.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        return jsonResponse.value;
      }) as Promise<any[]>;
  }
  public render(): React.ReactElement<INoticeProps> {
    return (
      <div className={styles.notice}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              {!this.state.item && (
                <NoticeDialog
                  isModalOpen={this.state.isModalOpen}
                  hideModal={this._HideModal}
                  item={this.state.item}
                  imgUrl={this.state.imgUrl}
                  Link={this.state.Link}
                  title={this.state.title}
                />
              )}
              {this.state.item && <p>{this.state.item}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
