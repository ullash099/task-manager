import axios from 'axios'
import React from 'react'
import { Badge, Button, Card, Col, Dropdown, DropdownButton, Form, ListGroup, Modal, Row } from 'react-bootstrap'
import BtnSaving from '../components/BtnSaving'
import { AppUrl, ShowToast } from '../components/Context'
import Loading from '../components/Loading'
import Select from 'react-select'
import { ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import TaskList from '../components/TaskList'

export default function Tasks(props) {
    const [isrefreshingList,setRefreshingList] = React.useState(false)
    const [isAddNewModalOpen,setAddNewModalOpen] = React.useState(false)
    const [isEditingInfo,setEditingInfo] = React.useState(false)    
    const [isSavingInfo,setSavingInfo] = React.useState(false)

    const [projectName,setProjectName] =React.useState(``)

    const priorities = [
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' }
    ]

    const [formData,setFormData] = React.useState({
        id : 0,
        project : 0,
        name : ``,
        priority : ``
    });

    const [taskList,setTaskList] = React.useState({})

    const handelGetTasks = async () => {
        setRefreshingList(true)
        await axios.get(AppUrl('/api/tasks/'+props.project))
        .then(function (response) {
            let info = response.data;
            setTaskList(info.tasks)
            setProjectName(info.project.name)
            setRefreshingList(false)
        });
    }

    const handleAddNewModalShow = () => setAddNewModalOpen(true);
    const handleAddNewModalClose = () => setAddNewModalOpen(false);

    const handelSavingInfo = async () => {

        setSavingInfo(true);
        const data = new FormData()
        data.append('id', formData.id.toString())
        data.append('project', props.project)
        data.append('name', formData.name)
        data.append('priority', formData.priority)
        
        await axios.post(AppUrl(`/api/save-task`),data)
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
                handelGetTasks().then(function(){
                    handelResetForm();
                    handleAddNewModalClose()
                })
            }
            setSavingInfo(false);
        })
    }

    const handelResetForm = () => {
        setFormData({
            ...formData,
            id : 0,
            project : 0,
            name : ``,
            priority : ``
        })
        setEditingInfo(false)
    }

    const handelEditWork = (obj) => {
        setFormData({
            ...formData,
            id : obj.id,
            name : obj.name,
            priority : obj.priority
        })
        setEditingInfo(true)
        handleAddNewModalShow()
    }

    const handelDeleteWork = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                await axios.get(AppUrl('/api/delete-task/'+id))
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
                    }
                    handelGetTasks()
                })
            }
        })
    }

    React.useEffect(()=>{
        handelGetTasks()
    },[props])

    return (
        <React.Fragment>
            <Card>
                <Card.Header>
                    <Card.Title className='d-inline'>{/* Project */}{projectName} Tasks</Card.Title>
                    <Button variant="success" className="float-end" onClick={handleAddNewModalShow.bind(this)}>
                        Add New
                    </Button>
                </Card.Header>
                <Card.Body onDragOver={e=>onDragOver(e)}>
                    {/* {
                        isrefreshingList ?
                        (<Loading />)
                        :(<TaskList list={taskList} onEdit={handelEditWork.bind(this)} onDelete={handelDeleteWork.bind(this)}/>)
                    } */}
                    <TaskList list={taskList} onEdit={handelEditWork.bind(this)} onDelete={handelDeleteWork.bind(this)}/>
                </Card.Body>
            </Card>

            <ToastContainer />

            <Modal
                size="md"
                show={isAddNewModalOpen}
                onHide={handleAddNewModalClose.bind(this)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Project Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-1" controlId="task">
                        <Form.Label className="m-0">Task <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            required={true} 
                            type="text" as="textarea"
                            value={formData.name}
                            onChange={
                                e => {
                                    setFormData({
                                        ...formData,
                                        name : e.target.value
                                    })
                                }
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-1" controlId="priority">
                        <Form.Label className="m-0">Priority <span className="text-danger">*</span></Form.Label>
                        <Select
                            //isClearable
                            value={priorities.filter(
                                option => (formData.priority && option.value.toString() === (formData.priority).toString())
                            )}
                            options={priorities}
                            onChange={
                                option => {
                                    setFormData({
                                        ...formData,
                                        priority : option ? option.value.toString() : ``
                                    })
                                }
                            }
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {
                        !isSavingInfo ? 
                        (
                            <Button className="float-end" variant="primary" 
                                onClick={handelSavingInfo.bind(this)}
                            >
                                {
                                    isEditingInfo ? `Update` : `Save`
                                }
                            </Button>
                        )
                        :(<BtnSaving variant="primary" text={ isEditingInfo ? `Updating...` : `Saving...`} />)
                    }
                </Modal.Footer>
            </Modal>

        </React.Fragment>
    )
}
