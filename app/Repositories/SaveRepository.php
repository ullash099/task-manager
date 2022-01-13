<?php
namespace App\Repositories;

use Exception;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaveRepository
{
    public function Project(Request $request)
    {
        if ($request->id != 0) {
            // update
            $info = Project::find($request->id);

            if (!empty($info)) {
                $info->name         =   $request->name;

                try {
                    $info->save();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name
            ];

            try {
                Project::create($data);
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }
    
    public function Task(Request $request)
    {
        if ($request->id != 0) {
            // update
            $info = Task::find($request->id);

            if (!empty($info)) {
                $info->name         =   $request->name;
                $info->priority     =   $request->priority;

                try {
                    $info->save();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $display_order = Task::where('project_id',$request->project)->max('display_order');
            $data = [
                '_token'            =>  $request->token,
                'project_id'        =>  $request->project,
                'name'              =>  $request->name,
                'priority'          =>  $request->priority,
                'display_order'     =>  $display_order+1,
            ];

            try {
                Task::create($data);
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function DeleteTask($id)
    {
        try {
            Task::where('id',$id)->delete();
            return response()->json(['success'=> 'successfully Deleted']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function ReorderTask(Request $request)
    {
        DB::beginTransaction();
        try {
            $num_elements = 0;
            while ($num_elements < count($request->id)) {
                Task::where('id',$request->id[$num_elements])
                ->update([
                    'display_order' => $request->display_order[$num_elements]
                ]);
                $num_elements++;
            }
            DB::commit();
            return response()->json(['success'=> 'successfully updated']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}