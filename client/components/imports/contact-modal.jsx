import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

class ContactModal extends Component {
  render() {
    return (
      <Modal
        closeIcon
        trigger={<Button>Contact</Button>}
        header='Contact'
        content='Test Content'
        actions={['Cancel', { key: 'send', content: 'Send', positive: true }]}
        />
	  );
  }
}

export default ContactModal;