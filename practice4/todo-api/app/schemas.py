from pydantic import BaseModel
from typing import Optional, List

# Task Schemas

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(TaskBase):
    project_id: int

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True

# Project Schemas

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    tasks: List[Task] = []

    class Config:
        orm_mode = True
