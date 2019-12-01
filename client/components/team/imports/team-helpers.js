import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

export const DIVISION_TYPES = [
  {
    text: 'WWU Student',
    value: 'wwu-student',
    wristBandColor: "Green",
    description: "All team members must be currently enrolled at WWU (undergrad or grad)."
  },
  {
    text: 'WWU Alumni',
    value: 'wwu-alumni',
    wristBandColor: "Blue",
    description: "At least half of team members must be WWU Alumni."
  },
  {
    text: 'High School',
    value: 'highschool',
    wristBandColor: "Purple",
    description: "All team members must be currently enrolled in high school. Exception: One adult chaperone per team may register as a team member."
  },
  {
    text: 'Open',
    value: 'open',
    wristBandColor: "Orange",
    description: "General public, mixed student/non-student, family (children under age 14 must be accompanied by a parent/guardian)."
  },
];

export const WRIST_BAND_COLOR = function(){
  let map = {};
  DIVISION_TYPES.forEach(div => {
    map[div.value] = div.wristBandColor
  });
  return map;
}();

export const DIVISION_MAP = function(){
  map = {};
  DIVISION_TYPES.forEach(div => {
    map[div.value] = div.text
  });
  return map;
}();
