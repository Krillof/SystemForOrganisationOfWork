from django.apps import AppConfig
from .models import *

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'
    def ready(self):
        # TODO: it's for test! delete after.
        #joshua = User(login="joshua", password="123").save()
        #caroline = User(login="caroline123", password="123").save()
        #sci_group = ScienceGroup(title="some sci group").save()
        #rel = sci_group.participants.connect(joshua)
        #rel.role = "Employee"
        #rel.save()
        #rel = sci_group.participants.connect(caroline)
        #rel.role = "Employee"
        #rel.save()
        #rel = joshua.science_groups.connect(sci_group)
        #rel.role = "Employee"
        #rel.save()
        #rel = caroline.science_groups.connect(sci_group)
        #rel.role = "Employee"
        #rel.save()
        #joshua.save()
        #caroline.save()
        #sci_group.save()
        if len(GlobalTheme.nodes.all()) == 0:
            gt1 = GlobalTheme(title="Global theme 1", x=100, y=100).save()
            t1 = Task(title="Task 1", x=400, y=100).save()
            t2 = Task(title="Task 2", x=100, y=400).save()
            rel1 = gt1.tasks.connect(t1)
            rel1.save()
            gt1.save()
            rel2 = gt1.tasks.connect(t2)
            rel2.save()
            gt1.save()
        


        
