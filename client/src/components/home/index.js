import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleBtn, editBtn } from './actions';
import { selectLanguage } from '../language-choice/actions';
import { postTranscriptGetTranslation } from '../dictaphone/actions';
import FaMicrophone from 'react-icons/lib/fa/microphone';
import Header from '../header';
import LanguageChoice from '../language-choice';
import EditButton from '../edit-btn';
import './home.css';
import Dictaphone from '../dictaphone';

export class Home extends Component {

  toggleSpeechRecognition() {
    this.props.dispatch(toggleBtn());
  }
  handleSpeechRecognition() {
    if (this.props.speechRecognitionOn) {
      return (<Dictaphone />);
    }
    else {
      return (
        <div>
        <button className="speak" onClick={(e) => this.toggleSpeechRecognition()}>
          <FaMicrophone />
        </button>
        <EditButton className="edit" onClick={e => this.toggleEdit()} />
        </div>
      );
    }
  }
  toggleEdit(e){
      this.props.dispatch(editBtn());
  }
  handleEditSubmit(event){
    event.preventDefault();
    let value = this.input.value;
    this.props.dispatch(postTranscriptGetTranslation(value, this.props.userLanguage));
  }
  handleEdit(e){
    if(!this.props.speechRecognitionOn){
      if(this.props.isEditing) {
        return (
          <div>
            <input type="text" ref={input => this.input = input} defaultValue={this.props.speechText.originalText}></input>
            <button className="submit" type="submit">Submit</button>
          </div>
        );
      }
      else {
        return (
          <div className="original-text-container">
            <p className="original-text" value="speak to have text trascribed">{this.props.speechText.originalText}</p>
            <div className="edit-container"></div>
          </div>
        );
      }
    }
  }

  render() {
    return (
      <div className="home-view">
        <LanguageChoice   languageProp={(language) => this.props.dispatch(selectLanguage(language))} />
        {this.handleSpeechRecognition()}
        <form id="translate" onSubmit={e =>{ this.handleEditSubmit(e);this.toggleEdit();}}>
          {this.handleEdit()}
        </form>
        <hr/>
        <div className="translation">
          <p>{this.props.speechText.translatedText}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  speechRecognitionOn: state.speech.speechRecognitionOn,
  speechText: state.basicTranslate,
  translatedText: state.basicTranslate.translatedText,
  isEditing: state.speech.isEditing,
  userLanguage: state.selectedLanguage.userLanguage

});

export default connect(mapStateToProps)(Home);