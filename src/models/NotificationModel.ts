interface NotificationModel {
  from: string;
  to: string;
  data: {
    id: string;
    notificationType: string;
  };
  title: string;
  body: string;
}
export default NotificationModel;
