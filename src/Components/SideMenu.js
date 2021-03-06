import React, { useState, useEffect } from "react";
import { Avatar, Button, IconButton, Menu, MenuItem } from "@material-ui/core";
import "./SideMenu.css";
import {
  Accessibility,
  ChevronLeft,
  ChevronRight,
  Equalizer,
  EventAvailable,
  HelpOutline,
  MenuOpen,
  Notes,
  PeopleAlt,
  ShowChart,
  SupervisedUserCircle,
  Wc,
} from "@material-ui/icons";
import { auth, db } from "../Files/firebase";
import {
  selectUser,
  loggedOutRecently,
  selectCurrentUserDBDetails,
} from "../redux/slices/userSlice";
import {
  selectSidebarState,
  setShrinkSideBar,
  selectActiveSectionIndex,
} from "../redux/slices/generalSlice";
import { useSelector, useDispatch } from "react-redux";
import NavigationOption from "./NavigationOption";
import { Link } from "react-router-dom";
import firebase from "firebase";

const SideMenu = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const currentUserDBDetails = useSelector(selectCurrentUserDBDetails);
  const activeSectionIndex = useSelector(selectActiveSectionIndex);
  const shrinkSidebar = useSelector(selectSidebarState);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.signOut();
    setAnchorEl(null);
    dispatch(loggedOutRecently());
    localStorage.removeItem("userRole");
  };

  const verifyAccountHandler = () => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {});
    handleClose();
  };

  const shrinkSidebarHnadler = () => {
    dispatch(setShrinkSideBar(true));
    handleClose();
  };

  const expandSidebarHandler = () => {
    dispatch(setShrinkSideBar(false));
  };

  const avatarClickHandler = (event) => {
    if (shrinkSidebar) {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <div
      className={`app__sideMenu ${shrinkSidebar && "appSideMenu__shrinked"}`}
    >
      {currentUser ? (
        <div className="sidebar__header">
          <Avatar
            onClick={avatarClickHandler}
            src={
              currentUserDBDetails?.userDetails?.accountPhotoURL
                ? currentUserDBDetails?.userDetails?.accountPhotoURL
                : currentUser?.photoUrl
            }
            className="sideBar__userAvatar pointer"
          />
          {!shrinkSidebar && (
            <div className="sideBar__userName pointer">
              {currentUserDBDetails?.userDetails?.companyUser ? (
                <>
                  <h3>
                    {currentUserDBDetails?.userDetails?.accountDisplayName
                      ? currentUserDBDetails?.userDetails?.accountDisplayName
                      : currentUserDBDetails?.userDetails?.companyCeoName}
                  </h3>
                  <span>
                    CEO @{currentUserDBDetails?.userDetails?.companyFullName}
                  </span>
                </>
              ) : (
                <>
                  <h3>
                    {currentUserDBDetails?.userDetails?.accountDisplayName
                      ? currentUserDBDetails?.userDetails?.accountDisplayName
                      : currentUser?.displayName}
                  </h3>
                  <span>
                    Member since:{" "}
                    {new Date(
                      currentUserDBDetails?.userDetails?.memberSince?.toDate()
                    ).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          )}

          {!shrinkSidebar && (
            <IconButton
              className="sideBar__menuIcon pointer"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MenuOpen fontSize="small" />
            </IconButton>
          )}

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {!shrinkSidebar && (
              <MenuItem onClick={shrinkSidebarHnadler}>
                <ChevronLeft />
              </MenuItem>
            )}

            <MenuItem onClick={verifyAccountHandler}>Verify Account</MenuItem>
            <MenuItem onClick={handleClose}>Reset Account Credentials</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      ) : (
        <div className="sidebar__header sidebar__headerNoUser">
          <h4>You are not logged in</h4>
          <Link to="/auth/signin">
            <Button>Login</Button>
          </Link>
        </div>
      )}

      <div className="sideBar__options">
        <NavigationOption
          tooltip={shrinkSidebar ? "Employees List" : ""}
          text="Employees List"
          icon={<SupervisedUserCircle />}
          section="/employees"
          sectionIndex={1}
          activeLink={activeSectionIndex === 1}
        />
        <NavigationOption
          tooltip={shrinkSidebar ? "Interviews" : ""}
          text="Interviews"
          icon={<Wc />}
          section="/interviews"
          sectionIndex={2}
          activeLink={activeSectionIndex === 2}
        />
        <NavigationOption
          tooltip={shrinkSidebar ? "Meetings" : ""}
          text="Meetings"
          icon={<PeopleAlt />}
          section="/meetings"
          sectionIndex={3}
          activeLink={activeSectionIndex === 3}
        />
        <NavigationOption
          tooltip={shrinkSidebar ? "Company Events" : ""}
          text="Company Events"
          icon={<EventAvailable />}
          section="/company-events"
          sectionIndex={4}
          activeLink={activeSectionIndex === 4}
        />
        <NavigationOption
          tooltip={shrinkSidebar ? "Stock News" : ""}
          text="Stock News"
          icon={<ShowChart />}
          section="/stock-news"
          sectionIndex={5}
          activeLink={activeSectionIndex === 5}
        />
        <NavigationOption
          tooltip={shrinkSidebar ? "FAQs" : ""}
          text="FAQs"
          icon={<HelpOutline />}
          section="/frequently-asked-questions"
          sectionIndex={6}
          activeLink={activeSectionIndex === 6}
        />
        <NavigationOption
          tooltip={shrinkSidebar ? "Help" : ""}
          text="Help"
          icon={<Accessibility />}
          section="/help"
          sectionIndex={7}
          activeLink={activeSectionIndex === 7}
        />
        {shrinkSidebar ? (
          <NavigationOption
            onClick={expandSidebarHandler}
            text="Help"
            icon={<ChevronRight />}
            tooltip={shrinkSidebar ? "Expand" : ""}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
