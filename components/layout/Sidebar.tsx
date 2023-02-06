import * as React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Typography, Box, TextField, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import menuData from '@/lib/menuData';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import GavelIcon from '@mui/icons-material/Gavel';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function Sidebar() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const router = useRouter()

	const [sideBarOpen, setSideBarOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState({article: false, private_construction: false, governor_permission: false, bid: false, user: false});

	const menuClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		setMenuOpen( {...menuOpen, [e.currentTarget.id]: !menuOpen[e.currentTarget.id]})
	}

	const onClickMenu = (url: string) => {
		router.push(url)
		setSideBarOpen(false)
	}

	const iconStyle = { color: 'white' }

	const menuIcon = (id: string) => {
		if(id === 'article'){	
			return <ArticleIcon style={iconStyle}/>
		} else if(id === 'private_construction') {
			return <EngineeringIcon style={iconStyle}/>
		} else if(id === 'governor_permission') {
			return <AssuredWorkloadIcon style={iconStyle}/>
		} else if(id === 'bid') {
			return <GavelIcon style={iconStyle}/>
		} else if(id === 'maintenance') {
			return <SettingsIcon style={iconStyle}/>
		}
	}


    const list = () => (
      <Box
        sx={{ 
          width: 300, 
          height: '100%', 
          backgroundColor: '#1e293b', 
          color: '#fff' 
        }}
        role="presentation"
        // onClick={() => setSideBarOpen(false)}
        // onKeyDown={() => setSideBarOpen(false)}
      >
        <List
          sx={{
            padding: '10px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '5px 10px'
            }}
          >
            <Box
              sx={{
                fontWeight: 'bold',
                fontSize: '20px'
              }}
            >
              メニュー
            </Box>
            <Box>
              <CloseIcon sx={{ cursor: 'pointer', color: '#fff', fontWeight: 'bold'}} onClick={() => setSideBarOpen(false)}/>
            </Box>
          </Box>
          {menuData.map((data, index) => (
            <>
              <ListItemButton
                key={index} 
                id={data.id} 
                onClick={(e) => menuClick(e)}
                sx={{
                  ':hover':{backgroundColor: '#2D3748'}
                }}
                >
                <ListItemIcon>
                  {menuIcon(data.id)}
                </ListItemIcon>
                <ListItemText 
                  primary={data.name} 
                  primaryTypographyProps={{
                      fontWeight: 'bold',
                    }}
                />
              {menuOpen[data.id] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
                <Collapse in={menuOpen[data.id]} timeout="auto" unmountOnExit>
                  {data.menus.map((menu, index) => {
                    let url = new RegExp(menu.url)
                    return (
                      <>
                        <List key={index} component="div" disablePadding>
                          <ListItemButton 
                            sx={{ 
                              pl: 4,
                              backgroundColor: router.pathname.match(url) && '#2D3748',
                              ':hover': {backgroundColor: '#2D3748'}
                            }}
                            onClick={() => onClickMenu(menu.url)}
                          >
                            <ListItemIcon 
                              sx={{
                                minWidth: '30px'
                              }}
                            >
                              <KeyboardArrowRightIcon style={{ color: 'white' }}/>
                            </ListItemIcon>
                            <ListItemText 
                              primary={menu.name}
                              primaryTypographyProps={{
                                fontWeight: 'bold',
                              }}
                            />
                          </ListItemButton>
                        </List>
                      </>
                    )
                  }
                  )}
                </Collapse>
            </>
          ))}
        </List>
      </Box>
    );

  return (
    <div>
        <React.Fragment>
          <MenuIcon fontSize='large' style={{ color: 'white' }} sx={{ cursor: 'pointer'}} onClick={() => setSideBarOpen(true)}/>
          <Drawer
            anchor={'left'}
            open={sideBarOpen}
            onClose={() => setSideBarOpen(false)}
          >
            {list()}
          </Drawer>
        </React.Fragment>
    </div>
  );
}