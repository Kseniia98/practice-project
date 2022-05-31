import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import Rating from 'react-rating';
import { withRouter } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { confirmAlert } from 'react-confirm-alert';
import {
  changeMark,
  clearChangeMarkError,
  goToExpandedDialog,
  changeShowImage,
} from '../../actions/actionCreator';
import CONSTANTS from '../../constants';
import styles from './OfferBox.module.sass';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';

const OfferBox = (props) => {
  const { id, role } = useSelector(state => state.userStore.data);
  const { messagesPreview } = useSelector(state => state.chatStore);
  const dispatch = useDispatch();

  const actions = bindActionCreators({
    changeMark,
    clearChangeMarkError,
    goToExpandedDialog,
    changeShowImage,
  }, dispatch);

  const findConversationInfo = () => {
    const participants = [id, props.data.User.id];
    participants.sort((participant1, participant2) => participant1 - participant2);
    for (let i = 0; i < messagesPreview.length; i++) {
      if (isEqual(participants, messagesPreview[i].participants)) {
        return {
          participants: messagesPreview[i].participants,
          _id: messagesPreview[i]._id,
          blackList: messagesPreview[i].blackList,
          favoriteList: messagesPreview[i].favoriteList,
        };
      }
    }
    return null;
  };

  const resolveOffer = () => {
    confirmAlert({
      title: 'confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => props.setOfferStatus(props.data.User.id, props.data.id, 'resolve'),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const rejectOffer = () => {
    confirmAlert({
      title: 'confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => props.setOfferStatus(props.data.User.id, props.data.id, 'reject'),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const changeMarkClick = (value) => {
    actions.clearError();
    actions.changeMark({
      mark: value,
      offerId: props.data.id,
      isFirst: !props.data.mark,
      creatorId: props.data.User.id,
    });
  };

  const offerStatus = () => {
    const { status } = props.data;
    if (status === CONSTANTS.OFFER_STATUS_REJECTED) {
      return <i className={classNames('fas fa-times-circle reject', styles.reject)} />;
    } if (status === CONSTANTS.OFFER_STATUS_WON) {
      return <i className={classNames('fas fa-check-circle resolve', styles.resolve)} />;
    }
    return null;
  };

  const goChat = () => {
    actions.goToExpandedDialog({ interlocutor: props.data.User, conversationData: findConversationInfo() });
  };

  const {
    data, contestType,
  } = props;
  console.log(props);
  const {
    firstName, lastName, email, rating,
  } = props.data.User;
  return (
    <div className={styles.offerContainer}>
      {offerStatus()}
      <div className={styles.mainInfoContainer}>
        <div className={styles.userInfo}>
          <div className={styles.creativeInfoContainer}>
            <img
              src={props.data.User?.avatar === 'anon.png' ? CONSTANTS.ANONYM_IMAGE_PATH : `${CONSTANTS.publicURL}${props.data.User?.avatar}`}
              alt="user"
            />
            <div className={styles.nameAndEmail}>
              <span>{`${firstName} ${lastName}`}</span>
              <span>{email}</span>
            </div>
          </div>
          <div className={styles.creativeRating}>
            <span className={styles.userScoreLabel}>Creative Rating </span>
            <Rating
              initialRating={rating}
              fractions={2}
              fullSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
              placeholderSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
              emptySymbol={(
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                  alt="star-outline"
                />
)}
              readonly
            />
          </div>
        </div>
        <div className={styles.responseConainer}>
          {
                        contestType === CONSTANTS.LOGO_CONTEST
                          ? (
                            <img
                              onClick={() => actions.changeShowImage({ imagePath: data.fileName, isShowOnFull: true })}
                              className={styles.responseLogo}
                              src={`${CONSTANTS.publicURL}${data.fileName}`}
                              alt="logo"
                            />
                          )
                          : <span className={styles.response}>{data.text}</span>
                    }
          {data.User.id !== id && (
          <Rating
            fractions={2}
            fullSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
            placeholderSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
            emptySymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`} alt="star" />}
            onClick={changeMarkClick}
            placeholderRating={data.mark}
          />
          )}
        </div>
        {role !== CONSTANTS.CREATOR && <i onClick={goChat} className="fas fa-comments" />}
      </div>
      {props.needButtons(data.status) && (
      <div className={styles.btnsContainer}>
        <div onClick={resolveOffer} className={styles.resolveBtn}>Resolve</div>
        <div onClick={rejectOffer} className={styles.rejectBtn}>Reject</div>
      </div>
      )}
    </div>
  );
};

export default withRouter(OfferBox);
