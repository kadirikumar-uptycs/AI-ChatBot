import React from 'react';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";
import { Provider } from 'react-redux'
import ErrorBoundary from './common/ErrorBoundary';
import { SnackbarProvider } from './hooks/SnackBarProvider';
import PageNotFound from './common/PageNotFound';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import WriteStory from './pages/WriteStory';
import ListenMusic from './pages/ListenMusic';
import Jokes from './pages/Jokes';
import Yoga from './pages/Yoga';
import ReadOnline from './pages/ReadOnline';
import Chat from './pages/Chat';
import Layout from './Layout';
import Layout1 from './Layout1';
import Users from './pages/users/Users';
import store from './store';
import './App.css';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path='/' element={<Layout />}>
				<Route index element={<LandingPage />}></Route>
				<Route path='category' element={<Layout1 />}>
					<Route path='jokes' element={<Jokes />}></Route>
					<Route path='music' element={<ListenMusic />}></Route>
					<Route path='readSuggestions' element={<ReadOnline />}></Route>
					<Route path='storyWriting' element={<WriteStory />}></Route>
					<Route path='yoga' element={<Yoga />}></Route>
					<Route path='chat' element={<Chat />}></Route>
					<Route path='users' element={<Users />}></Route>
				</Route>
			</Route>
			<Route path='login' element={<Login />}></Route>
			<Route path='*' element={<PageNotFound />}></Route>
		</Route>
	)
);

export default function App() {
	return (
		<Provider store={store}>
			<SnackbarProvider>
				<ErrorBoundary>
					<RouterProvider router={router} />
				</ErrorBoundary>
			</SnackbarProvider>
		</Provider>
	);
}