import Icon from "react-native-vector-icons/Ionicons"
import {Text} from 'react-native';

const Icons = ({name, size, color}) => {
  switch (name) {
    case 'logout':
      return <Icon name="log-out-outline" size={size} color={color} />;
      break;
    case 'map':
      return <Icon name="navigate" size={size} color={color} />;
      break;
    case 'home':
      return <Icon name="home-outline" size={size} color={color} />;
    case 'ticket':
      return <Icon name="ticket" size={size} color={color} />;
      break;
    case 'attend':
      return <Icon name="people-circle-outlie" size={size} color={color} />;
      break;

    default:
      break;
  }
};

export default Icons;
