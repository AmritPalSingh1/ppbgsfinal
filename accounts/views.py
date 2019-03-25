from django.shortcuts import render, redirect
from django.contrib import messages, auth
from django.contrib.auth.models import User

from userprogress.models import TotalCoins, TotalPoints, UserLastLocation, Level
from topics.models import Topic
from flowchart.models import Progress


def register(request):
    if request.method == 'POST':
        # Get form values
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        # Check if passwords match
        if password == password2:
            # Check username
            if User.objects.filter(username=username).exists():
                messages.error(request, 'That username is taken')
                return redirect('register')
            else:
                if User.objects.filter(email=email).exists():
                    messages.error(request, 'That email is being used')
                    return redirect('register')
                else:
                    # Looks good
                    user = User.objects.create_user(
                        username=username, password=password, email=email, first_name=first_name, last_name=last_name)

                    user.save()

                    # add user to total points table
                    user_total_points = TotalPoints(user=user)
                    user_total_points.save()

                    # add user to total coins table
                    user_total_coins = TotalCoins(user=user)
                    user_total_coins.save()

                    # set up user's last visited location
                    first_topic = Topic.objects.get(topicName="Intro to Html")

                    user_last_location = UserLastLocation(user=user, topic=first_topic, location="videos")
                    user_last_location.save()

                    # start flowchart
                    flowchart_progress = Progress(user=user)
                    flowchart_progress.save()

                    # set user level
                    user_level = Level(user=user)
                    user_level.save()

                    messages.success(
                        request, 'You are now registered and can log in')
                    return redirect('login')
        else:
            messages.error(request, 'Passwords do not match')
            return redirect('register')
    else:
        return render(request, 'accounts/register.html')


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            messages.success(request, 'You are now logged in')
            return redirect('topics')
        else:
            messages.error(request, 'Invalid credentials')
            return redirect('login')

    else:
        return render(request, 'accounts/login.html')


def logout(request):
    if request.method == 'POST':
        auth.logout(request)
        messages.success(request, 'You are now logged out')
    return redirect('login')
