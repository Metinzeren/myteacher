interface NotificationModel {
  from: string;
  to: string;
  data: {
    id: string;
    notificationType: string;
    studentId: string;
    classRoomId: string;
  };
  title: string;
  body: string;
  isRead: boolean;
  createdDate: Date;
}
export default NotificationModel;
