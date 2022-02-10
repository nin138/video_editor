import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { ReactElement } from 'react';
import styles from './ContextMenu.module.css';

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  'aria-controls'?: string;
  'aria-haspopup': 'true';
  'aria-expanded'?: 'true';
  id: string;
}

interface MenuProps {
  title: string;
  onClick: () => void;
}

interface Props {
  children: (props: ButtonProps) => ReactElement;
  id: string;
  menu: MenuProps[];
}

export const ContextMenu: React.VFC<Props> = ({ children, id, menu }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const withHandleClose = (cb: () => void) => () => {
    handleClose();
    cb();
  };

  const menuId = id + '-menu';

  return (
    <div>
      {children({
        onClick: handleClick,
        'aria-controls': open ? menuId : undefined,
        'aria-haspopup': 'true',
        'aria-expanded': open ? 'true' : undefined,
        id,
      })}
      <Menu
        id={menuId}
        MenuListProps={{
          'aria-labelledby': id,
          className: styles.menu,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {menu.map((it, i) => (
          <MenuItem
            key={i}
            className={styles.menuItem}
            onClick={withHandleClose(it.onClick)}
          >
            {it.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
