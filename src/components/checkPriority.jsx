import {Text} from 'react-native';

export default function CheckPriority(status) {
  switch (status) {
    case 'High':
      return (
        <Text className="bg-red-500 text-white py-2 px-4 rounded-full text-center">
          {status}
        </Text>
      );
      break;
    case 'Medium':
      return (
        <Text className="bg-yellow-500 text-white py-2 px-4 rounded-full text-center">
          {status}
        </Text>
      );
      break;
    case 'Low':
      return (
        <Text className="bg-blue-500 text-white py-2 px-4 rounded-full text-center">
          {status}
        </Text>
      );
      break;

    default:
      break;
  }
}
