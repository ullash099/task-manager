<?php

namespace App\Http\Controllers\api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Repositories\SaveRepository;
use App\Repositories\ValidationRepository;

class TasksController extends Controller
{
    private $vr;
    private $save;
    public function __construct(ValidationRepository $validationRepository, SaveRepository $saveRepository)
    {
        $this->vr = $validationRepository;
        $this->save = $saveRepository; 
    }

    public function index($project)
    {
        return response()->json([
            'project'   =>  Project::find($project),
            'tasks'     => Task::where('project_id',$project)->orderBy('display_order')->get()
        ]);
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidTask($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->Task($request);
    }

    public function reorder(Request $request)
    {
        return $this->save->ReorderTask($request);
    }

    public function destroy($id)
    {
        return $this->save->DeleteTask($id);
    }
}
