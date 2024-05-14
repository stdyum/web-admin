import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

interface Node {
  display: string;
  url?: string;
  children?: Node[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  url?: string;
  level: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTree, MatTreeNode, MatIcon, MatIconButton, MatTreeNodeToggle, MatTreeNodePadding, MatTreeNodeDef, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );
  treeFlattener = new MatTreeFlattener(
    (node: Node, level: number): ExampleFlatNode => {
      return {
        expandable: !!node.children && node.children.length > 0,
        name: node.display,
        url: node.url,
        level: level,
      };
    },
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = [
      {
        display: 'Enrollments',
        children: [
          {
            display: 'Accepted',
            url: '/enrollments/accepted',
          },
          {
            display: 'Requests',
            url: '/enrollments/requests',
          },
        ],
      },
      {
        display: 'Registry',
        children: [
          {
            display: 'Groups',
            url: '/registry/groups',
          },
          {
            display: 'Rooms',
            url: '/registry/rooms',
          },
          {
            display: 'Students',
            url: '/registry/students',
          },
          {
            display: 'Subjects',
            url: '/registry/subjects',
          },
          {
            display: 'Teachers',
            url: '/registry/teachers',
          },
        ],
      },
      {
        display: 'Schedule',
      },
      {
        display: 'Journal',
      },
    ];
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
