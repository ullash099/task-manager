import ReactDOM from 'react-dom'
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom"
import { Navbar, Container, Nav } from 'react-bootstrap'
import { AppUrl } from '../components/Context'
import Projects from './Projects'
import Tasks from './Tasks'

export default function Template() {
    return (
        <BrowserRouter>
            <React.Fragment>
                <Navbar bg="dark" expand="lg">
                    <Container>
                        <Link to={AppUrl('/')} className='navbar-brand text-light'>Task Manager</Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">

                            {/* <Link to={AppUrl('/projects')} className='nav-link text-light'>Projects</Link> */}
                            {/* <Link to={AppUrl('/task')} className='nav-link text-light'>Task</Link> */}
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container fluid>
                    <Routes>
                        <Route exact path={AppUrl(`/`)} element={<Projects />} />
                    </Routes>
                </Container>
            </React.Fragment>
        </BrowserRouter>
    )
}
if (document.getElementById('app')) {
    ReactDOM.render(<Template />, document.getElementById('app'));
}