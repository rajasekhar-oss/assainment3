
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  tname = '';
  pri = '';
  date = '';
  status = 'All';

  allTasks: {
    name: string;
    priority: string;
    dueDate: string;
    priorityBadge: string;
    status: 'Pending' | 'Completed';
    isOverdue: boolean;
  }[] = [];

  get filteredTasks() {
    let filtered = [...this.allTasks];

    if (this.status === 'Completed') {
      filtered = filtered.filter(task => task.status === 'Completed');
    } else if (this.status === 'Pending') {
      filtered = filtered.filter(task => task.status === 'Pending');
    } else if (this.status === 'Overdue') {
      filtered = filtered.filter(task => task.isOverdue && task.status === 'Pending');
    } else if (this.status === 'High Priority') {
      filtered = filtered.filter(task => task.priority === 'High');
    } else if (this.status === 'Medium Priority') {
      filtered = filtered.filter(task => task.priority === 'Medium');
    } else if (this.status === 'Low Priority') {
      filtered = filtered.filter(task => task.priority === 'Low');
    }

    return filtered;
  }

  get taskSummary() {
    const total = this.allTasks.length;
    const completed = this.allTasks.filter(task => task.status === 'Completed').length;
    const pending = this.allTasks.filter(task => task.status === 'Pending').length;
    const overdue = this.allTasks.filter(task => task.isOverdue && task.status === 'Pending').length;
    return { total, completed, pending, overdue };
  }

  addTask() {
    if (!this.tname || !this.pri || !this.date) return;

    const badge = this.pri === 'High' ? '🔴' : this.pri === 'Medium' ? '🟠' : '🟢';
    const isOverdue = new Date(this.date) < new Date();

    this.allTasks.push({
      name: this.tname,
      priority: this.pri,
      dueDate: this.date,
      priorityBadge: badge,
      status: 'Pending',
      isOverdue,
    });

    this.tname = '';
    this.pri = '';
    this.date = '';
  }

  toggleStatus(index: number) {
    const task = this.filteredTasks[index];
    const realIndex = this.allTasks.findIndex(
      t =>
        t.name === task.name &&
        t.dueDate === task.dueDate &&
        t.priority === task.priority
    );

    this.allTasks[realIndex].status =
      this.allTasks[realIndex].status === 'Completed' ? 'Pending' : 'Completed';

    this.allTasks[realIndex].isOverdue =
      new Date(this.allTasks[realIndex].dueDate) < new Date() &&
      this.allTasks[realIndex].status === 'Pending';
  }

  deleteTask(index: number) {
    const task = this.filteredTasks[index];
    this.allTasks = this.allTasks.filter(t => t !== task);
  }

  clearAll() {
    const confirmed = confirm('Are you sure you want to delete all tasks?');
    if (confirmed) {
      this.allTasks = [];
    }
  }

  filterTasks() {
  }
}
