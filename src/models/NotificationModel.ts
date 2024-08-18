interface NotificationModel {
  from: string;
  to: string[];
  data: {
    id: string;
    notificationType: string;
    studentId: string;
    classRoomId: string;
    isTranslate?: string;
  };
  title: string;
  body: string;
  isRead: boolean;
  createdDate: Date;
  isApproved: 'approved' | 'rejected' | 'pending';
}
export default NotificationModel;
