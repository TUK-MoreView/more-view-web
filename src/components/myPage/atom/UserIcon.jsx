import { ReactComponent as Message } from '../../../assets/myPage/message.svg';
import { ReactComponent as Trash } from '../../../assets/myPage/trash.svg';
import { ReactComponent as Edit } from '../../../assets/myPage/edit.svg';
import { ReactComponent as Play } from '../../../assets/myPage/play.svg';

const ICON = {
  Message,
  Trash,
  Edit,
  Play,
};

function UserIcon({ type }) {
  const Icon = ICON[type];
  if (!Icon) return null;

  return <Icon width="1.6666666666666667vw" height="2.9629629629629632vh" />;
}

export default UserIcon;
