<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('projects', 'api\ProjectsController@index');
Route::post('save-project', 'api\ProjectsController@store');
Route::get('tasks/{id}', 'api\TasksController@index');
Route::post('save-task', 'api\TasksController@store');
Route::post('save-reorder-task', 'api\TasksController@reorder');
Route::get('delete-task/{id}', 'api\TasksController@destroy');
