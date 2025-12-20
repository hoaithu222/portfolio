import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';

const config: AvatarCreatorConfig = {
  clearCache: true,
  bodyType: 'fullbody',
  quickStart: false,
  language: 'en',
};

const style = { width: '100%', height: '100vh', border: 'none' };

export default function App() {
  const handleOnAvatarExported = (event: AvatarExportedEvent) => {
    console.log(`Avatar URL is: ${event.data.url}`);
  };

  return (
    <>
      <AvatarCreator subdomain="https://portfolio-350yxn.readyplayer.me/avatar" config={config} style={style} onAvatarExported={handleOnAvatarExported} />
    </>
  );
}