import axios from 'axios';
import NotificationModel from '../models/NotificationModel';

export const deleteStudent = async ({
  accessToken,
  data,
}: {
  accessToken: any;
  data: any;
}) => {
  return await axios.delete(
    'https://europe-west1-my-teacher-553bb.cloudfunctions.net/deleteStudent',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    },
  );
};
export const sendNotification = (model: NotificationModel) => {
  let data = JSON.stringify(model);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://europe-west1-my-teacher-553bb.cloudfunctions.net/sendNotification',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  return axios.request(config);
};
