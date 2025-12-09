from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('nova/', views.nova_transacao, name='nova_transacao'),
]