import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION_MUTATION = gql`
  mutation Mutation($notificationInput: notificationInput) {
    createNotification(notificationInput: $notificationInput) {
      id
      notification_status
      notification_text
      notification_type
    #   receiver
    #   reference_id
    #   reference_type
    #   sender
    }
  }
`;
