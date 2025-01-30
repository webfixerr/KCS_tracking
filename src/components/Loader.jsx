import {ActivityIndicator, View} from 'react-native';

const Loader = () => {
  return (
    <View className="flex flex-1 justify-center items-center">
      <ActivityIndicator size={'large'} />
    </View>
  );
};

export default Loader;
