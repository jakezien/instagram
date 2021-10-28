/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import UserContext from "../../context/user";
import { useContext, useState } from "react";
import Edit from './edit'

export default function Header({ username, caption }) {

  return (
    <div className="flex border-gray-primary h-4 p-4 py-8">
      <div className="flex w-full justify-between items-center">
        <Link to={`/p/${username}`} className="flex items-center">
          <img
            className="rounded-full h-8 w-8 flex mr-3"
            src={`/images/avatars/${username}.jpg`}
            alt={`${username} profile picture`}
          />
          <p className="font-bold">{username}</p>
        </Link>
        
        <Edit caption={caption} />
      </div>
    </div>
  );
}

Header.propTypes = {
  username: PropTypes.string.isRequired,
};
