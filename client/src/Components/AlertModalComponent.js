import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class PromptModal extends Component {
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
            <Modal.Title>{this.props.heading}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.body}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.close}>
              {this.props.text}
            </Button>
          </Modal.Footer>
      </Modal>
    );
  }
}
