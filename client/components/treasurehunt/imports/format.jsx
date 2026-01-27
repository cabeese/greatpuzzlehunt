import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

export function formatLabel(text) {
  if (text == null) {
    return "";
  }

  const s = text.split("\n\n");
  const a = s.map((line) => oneline(line));
  return a;
};

function oneline(text) {
  return(
    <p> { text } </p>
  );
};

