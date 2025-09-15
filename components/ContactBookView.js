import React from 'react';
import PlaceholderView from './PlaceholderView.js';

const ContactBookView = () => {
  return (
    React.createElement(PlaceholderView,
      { title: "Contact Book",
      message: "This feature is coming soon. You will be able to manage all your contacts here." }
    )
  );
};

export default ContactBookView;
