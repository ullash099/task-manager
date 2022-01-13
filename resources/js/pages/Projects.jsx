import React from 'react'
import { Button, Card, Col, FormControl, InputGroup, ListGroup, Row } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import BtnSaving from '../components/BtnSaving'
import { ShowToast, AppUrl } from '../components/Context'
import Tasks from './Tasks'

export default function Projects(props) {
    const [projectList,setProjectList] = React.useState({})
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [activeProject,setActiveProject] = React.useState(0)

    const [projectForm,setProjectForm] = React.useState({
        id : 0,
        name : ``
    })

    const handelGetProjects = async () => {
        await axios.get(AppUrl('/api/projects'))
        .then(function (response) {
            let info = response.data;          
            setProjectList(info)
        });
    }

    const handelAddNewProject = async () => {
        if(projectForm.name){
            setSavingInfo(true)
            const data = new FormData()
            data.append('id', projectForm.id)
            data.append('name', projectForm.name)
            await axios.post(AppUrl(`/api/save-project`),data)
            .then(function (response) {
                let info = response.data;
                if(info.errors){
                    (info.errors).map((error)=>(
                        ShowToast({
                            type : 'error',
                            msg  : error
                        })
                    ));
                }
                else if(info.success){
                    ShowToast({
                        type : 'success',
                        msg  : info.success
                    })
                    setProjectForm({
                        ...projectForm,
                        id : 0,
                        name : ``
                    })
                    handelGetProjects()
                }
                setSavingInfo(false)
            })
        }
    }

    const handelActiveProject = (obj) => {
        setActiveProject(obj.id)
    }

    React.useEffect(()=>{
        handelGetProjects()
    },[props])

    return (
        <Row>
            <Col md={4}>
                <Card>
                    <Card.Header>
                        <Card.Title>Projects</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <InputGroup className='mb-2'>
                            <FormControl placeholder="project name" 
                                value={projectForm.name}
                                onChange={e=>{
                                    setProjectForm({
                                        ...projectForm,
                                        name : e.target.value
                                    })
                                }} 
                            />
                            {
                                !isSavingInfo ? 
                                (
                                    <Button variant="primary" className="input-group-text"
                                        onClick={handelAddNewProject.bind(this)} 
                                    >
                                        Save
                                    </Button>
                                )
                                :(<BtnSaving variant="primary" text='Saving...' />)
                            }
                        </InputGroup>

                        <ListGroup as="ul">
                            {
                                Object.keys(projectList).length > 0 ? (
                                    Object.values(projectList).map((project,index)=>(
                                        <ListGroup.Item as="li" key={index}
                                            active={ activeProject == project.id ? true : false}
                                            onClick={() => handelActiveProject(project)} 
                                        >
                                            {project.name}
                                        </ListGroup.Item>
                                    ))
                                )
                                :(<ListGroup.Item>No Record Found</ListGroup.Item>)
                            }
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={8}>
                {
                    activeProject != 0 ? (<Tasks project={activeProject} />) : (``)
                }
            </Col>

            <ToastContainer />
        </Row>
    )
}
