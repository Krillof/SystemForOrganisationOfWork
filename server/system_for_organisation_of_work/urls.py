"""
URL configuration for system_for_organisation_for_work project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/test', views.api_test),
    re_path(r'^api/users/enter', views.user_enter),
    re_path(r'^api/users/register', views.user_register),
    re_path(r'^api/users/leave', views.user_leave),
    re_path(r'^api/users/delete', views.user_delete),
    re_path(r'^api/science_groups/get_available_groups', views.science_group_get_available_groups),
    re_path(r'^api/science_groups/send_membership_request', views.science_group_send_membership_request),
    re_path(r'^api/science_groups/get_membership_requests', views.science_group_get_membership_requests),
    re_path(r'^api/science_groups/accept_membership_request', views.science_group_accept_membership_request),
    re_path(r'^api/science_groups/get_participated_groups', views.science_group_get_participated_groups),
    re_path(r'^api/science_groups/enter', views.science_group_enter),
    re_path(r'^api/science_groups/check_if_entered', views.science_group_check_if_entered),
    re_path(r'^api/science_groups/leave', views.science_group_leave),
    re_path(r'^api/science_groups/workspace/update_mindmap', views.workspace_update_mindmap),
    re_path(r'^api/science_groups/workspace/create_global_theme_vertex', views.workspace_create_global_theme_vertex),
    re_path(r'^api/science_groups/workspace/create_task_vertex', views.workspace_create_task_vertex),
    re_path(r'^api/science_groups/workspace/create_article_vertex', views.workspace_create_article_vertex),
    re_path(r'^api/science_groups/workspace/delete_vertex', views.workspace_delete_vertex),
    re_path(r'^api/science_groups/workspace/get_article_data', views.workspace_get_article_data),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
