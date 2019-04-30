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
            <Button variant="secondary" onClick={this.props.close}>
              {this.props.secondarytext}
            </Button>
            <Button variant="primary" onClick={this.props.primaryaction}>
              {this.props.primarytext}
            </Button>
          </Modal.Footer>
      </Modal>
    );
  }
}
