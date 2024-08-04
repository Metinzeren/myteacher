import NotificationModel from "./NotificationModel";
import Student from "./Student";

interface NotificationResponse extends NotificationModel {
    student: Student;
}

export default NotificationResponse;