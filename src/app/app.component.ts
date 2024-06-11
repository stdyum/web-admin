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
import { TranslationPipe } from '@likdan/studyum-core';

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
  imports: [
    RouterOutlet,
    MatTree,
    MatTreeNode,
    MatIcon,
    MatIconButton,
    MatTreeNodeToggle,
    MatTreeNodePadding,
    MatTreeNodeDef,
    RouterLink,
    TranslationPipe
  ],
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
        display: 'nav_enrollments',
        children: [
          {
            display: 'nav_enrollments_accepted',
            url: '/enrollments/accepted',
          },
          {
            display: 'nav_enrollments_requests',
            url: '/enrollments/requests',
          },
        ],
      },
      {
        display: 'nav_registry',
        children: [
          {
            display: 'nav_registry_groups',
            url: '/registry/groups',
          },
          {
            display: 'nav_registry_rooms',
            url: '/registry/rooms',
          },
          {
            display: 'nav_registry_students',
            url: '/registry/students',
          },
          {
            display: 'nav_registry_subjects',
            url: '/registry/subjects',
          },
          {
            display: 'nav_registry_teachers',
            url: '/registry/teachers',
          },
        ],
      },
      {
        display: 'nav_schedule',
      },
      {
        display: 'nav_journal',
      },
    ];
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
