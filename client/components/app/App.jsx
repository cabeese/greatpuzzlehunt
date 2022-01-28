// Main App - React Root Component

import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from 'react-scroll-up';
import { Button } from 'semantic-ui-react';
import { Route, Routes } from 'react-router-dom';

export default App = class App extends Component {
    
    componentDidMount() {
	document.title = Meteor.settings.public.siteName;
    }
    
    render() {
	return (
	    <div id="app-root">
		<TopBar />
		<Outlet />
		<Footer />
		
		<ScrollToTop showUnder={1000}>
		    <Button labelPosition="right" icon="up arrow" content="Scroll Up" className='scroll-top-btn'/>
		</ScrollToTop>
	    </div>
	);
    }
    
}
