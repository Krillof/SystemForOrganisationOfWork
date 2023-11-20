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
            sci_group = ScienceGroup(title="some sci group", x=0, y=0).save()
            joshua = User(login="joshua", password="123", x=200, y=0).save()
            joshua.connect_and_write_role(sci_group, Role.Employee)
            caroline = User(login="caroline123", password="123", x=200, y=100).save()
            caroline.connect_and_write_role(sci_group, Role.Employee)
            gt1 = GlobalTheme(title="Global theme 1", x=400, y=0).save()
            gt1.connect_and_write_creation_date(sci_group)
            t1 = Task(title="Task 1", x=600, y=0).save()
            t1.connect_and_write_creation_date(gt1)
            t2 = Task(title="Task 2", x=600, y=100).save()
            t2.connect_and_write_creation_date(gt1)
            art1 = Article(doi="https://doi.org/10.3390/membranes13050503", citations=100, accesses=500, x=800, y=100).save()
            art1.connect_and_write_creation_date(t2)


            joshua.save()
            caroline.save()
            sci_group.save()
            gt1.save()
            t1.save()
            t2.save()
            art1.save()
        


        
