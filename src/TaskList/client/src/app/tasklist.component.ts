import { Component, OnInit } from '@angular/core';

import { TaskItem } from './taskitem';
import { TaskListService } from './tasklist.service';
import { TaskListResponse } from './tasklist.response';

@Component ({
    selector: 'task-list',
    templateUrl: './tasklist.component.html',
    styleUrls: ['./tasklist.component.css'],
    providers: [TaskListService]
})

export class TaskListComponent implements OnInit {

    private taskListResponse: TaskListResponse;
    
    // The number array which holds the indecies of each page.
    private pageIndecies: number[] = new Array();

    // The number which holds the current page number.
    private currentPageIdx: number;

    private newTaskItemTitle: string;

    private hideRequiredMessage: boolean = true;

    ngOnInit(): void {
        this.getTaskList();
        
    }

    constructor (private service: TaskListService) {

    }

    private getTaskList(): void {
        this.service.getTaskList()
            .then(response => {
                this.taskListResponse = response;
                console.log(`Total Records: ${response.totalRecords}, Total Pages: ${response.totalPages} `);
                for(var idx = 1; idx <= response.totalPages; idx++) {
                    this.pageIndecies[idx - 1] = idx;
                }
                
                this.currentPageIdx = response.totalPages > 0 ? 1 : 0;
        });
    }

    private onStatusUpdated(item): void {
        this.service.updateItemStatus(item);
    }

    private onPageSelected(idx): void {
        this.service.getTaskList(idx)
            .then(response => {
                this.taskListResponse = response;
                this.currentPageIdx = idx;
            });
    }

    private onAddNewClick(): void {
        this.hideRequiredMessage = this.newTaskItemTitle != null && this.newTaskItemTitle != '';
        if (this.newTaskItemTitle) {
            this.service.addNew(this.newTaskItemTitle)
                .then(response => {
                    this.getTaskList();
                    this.newTaskItemTitle = '';
                    this.hideRequiredMessage = true;
                });
            
        }
    }

    private onUpdateAllStatusClick(done: boolean): void {
        this.service.updateAllStatus(done)
            .then(response => {
                this.getTaskList();
            });
    }
}