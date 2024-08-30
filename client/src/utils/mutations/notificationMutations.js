import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION_MUTATION = gql`
  mutation Mutation($notificationInput: notificationInput) {
    createNotification(notificationInput: $notificationInput) {
      id
      notification_status
      notification_text
      notification_type
    }
  }
`;

export const UPDATE_NOTIFICATION_STATUS_MUTATION = gql`
  mutation Mutation($notificationId: ID!, $notificationStatus: String!) {
    updateNotificationStatus(
      notificationId: $notificationId
      notificationStatus: $notificationStatus
    ) {
      createdAt
      id
      notification_status
      notification_text
      notification_type
      updatedAt
    }
  }
`;

export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation Mutation($receiverId: ID!, $notificationId: ID!) {
    deleteNotification(
      receiverId: $receiverId
      notificationId: $notificationId
    ) {
      # display_name
      # notifications
      id
    }
  }
`;
