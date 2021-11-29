import * as React from "react";
import { Dialog } from "office-ui-fabric-react";
import styles from "./Notice.module.scss";

const NoticeDialog = (props) => {
  console.log(props);
  return (
    <Dialog
      className={styles.maxWidth}
      isOpen={props.isModalOpen}
      onDismiss={props.hideModal}
      isBlocking={false}
    >
      <span className={styles.title}>{props.Title}</span>
      <p className={styles.subTitle}>{props.subTitle}</p>
      <p className={styles.description}>{props.description}</p>
      <a href={props.Link} className={styles.button}>
        <img src={props.imgUrl} alt="Notice Banner" />
      </a>
    </Dialog>
  );
};

export default NoticeDialog;
