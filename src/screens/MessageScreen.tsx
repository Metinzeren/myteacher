import React, {useState, useEffect, useCallback} from 'react';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {db} from '../firebase/config';
import useUser from '../hooks/useUser';

const ChatScreen = () => {
  const {user} = useUser() as any;
  console.log(user);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const firebaseMessages = snapshot.docs.map(doc => {
        const firebaseData = doc.data();
        return {
          _id: doc.id,
          text: firebaseData.text,
          createdAt: firebaseData.createdAt?.toDate() || new Date(),
          user: {
            _id: firebaseData.user._id,
            name: firebaseData.user.name,
          },
        } as IMessage;
      });

      setMessages(firebaseMessages);
    });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    const [newMessage] = newMessages;
    addDoc(collection(db, 'messages'), {
      text: newMessage.text,
      createdAt: new Date(),
      user: newMessage.user,
    });
  }, []);

  return (
    <GiftedChat
      placeholder="Mesaj Yaz"
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: user?.id,
        name: user?.firstName + ' ' + user?.lastName,
      }}
    />
  );
};

export default ChatScreen;
