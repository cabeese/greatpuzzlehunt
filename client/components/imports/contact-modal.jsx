import React, { Component } from 'react';
import { Button, Modal, Form, TextArea } from 'semantic-ui-react';

class ContactModal extends Component {
  render() {
    return (
      <Modal
        closeIcon
        trigger={<Button>Contact</Button>}
        closeOnDimmerClick={false}
        header='Contact'
        content={
          <Form>
            <TextArea placeholder='Write why you want to join this team!' />
          </Form>
        }
        actions={[{ key: 'cancel', content: 'Cancel', negative: true}, { key: 'send', content: 'Send', positive: true }]}
        />
	  );
  }
}

export default ContactModal;