<?php
namespace App\Repositories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ValidationRepository
{
    public function isValidProject(Request $request)
    {
        if($request->id != 0){
            return Validator::make($request->all(), [
                'name'  =>  'required|max:190|unique:projects,name,'. $request->id
            ]);
        }
        return Validator::make($request->all(), [
            'name'   =>  'required|max:190|unique:projects,name',
        ]);
    }
    
    public function isValidTask(Request $request)
    {
        return Validator::make($request->all(), [
            'project'   => 'required|exists:projects,id',
            'name'      => 'required|max:190',
            'priority'  => 'required|in:High,Medium,Low',
        ]);
    }
}