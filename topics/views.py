from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

# Import required models
from .models import Topic, Video, Question, Pdf, Query, Comment
from userprogress.models import UserAttemptedQuestion, UserWatchedVideo, UserReadNotes, TotalCoins, TotalPoints, UserLastLocation
from django.contrib.auth.models import User
from challenges.models import Challenge, DoublePoint, FreeWin, Hint
from userprogress.models import TotalPoints, TotalCoins


def user_info(request):
    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')

    # current user's rank
    rank = 1
    for singleUser in allUsers:
        if singleUser.user == request.user:
            break
        rank += 1

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    user_data = {
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins
    }

    return user_data

def update_user_points(request, points):
    # update total points
    total_points = TotalPoints.objects.get(user=request.user)
    total_points.points = total_points.points + points
    total_points.save()

def update_user_coins(request, coins):
    # update total coins
    total_coins = TotalCoins.objects.get(user=request.user)
    total_coins.coins = total_coins.coins + coins
    total_coins.save()

def update_user_last_location(request, location, topic):       
    # update user's last visited location
    user_last_location = UserLastLocation.objects.get(user=request.user)
    user_last_location.topic = topic
    user_last_location.location = location
    user_last_location.save()


@login_required
def topic(request, topic_name):

    user_data = user_info(request)

    # get current topic otherwise 404 page
    topic = get_object_or_404(Topic, topicName=topic_name)

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'video': videos[0].key,
        'user_data': user_data
    }

    return render(request, 'pages/topic.html', context)



@login_required
def videos(request):

    # Initializing points update message
    message_title = None
    points_up = None
    coins_up = None

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Fetch all the videos related to current topic
    videos = Video.objects.filter(topic=topic)

    # key of the current video to display
    key = request.GET['key']

    #current video
    current_video = Video.objects.get(topic=topic, key=key)

    already_watched_video = UserWatchedVideo.objects.filter(video=current_video, user=request.user)

    if not already_watched_video:
        # add video to user watched history
        watched_video = UserWatchedVideo(video=current_video, user=request.user)
        watched_video.save()

        update_user_points(request, 2)
        update_user_coins(request, 4)

        message_title = "Explored new Video!"
        points_up = 2
        coins_up = 4

    user_data = user_info(request)

    update_user_last_location(request, 'videos', topic)

    context = {
        'topic': topic,
        'videos': videos,
        'key': key,
        'user_data': user_data,
        'message_title': message_title,
        'points_up': points_up,
        'coins_up': coins_up
    }

    return render(request, 'pages/videos.html', context)


@login_required
def notes(request):
    # Initializing points update message
    message_title = None
    points_up = None
    coins_up = None

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Fetch current topic's pdf
    pdf = Pdf.objects.get(topic=topic)


    already_read_notes = UserReadNotes.objects.filter(pdf=pdf, user=request.user)
    if not already_read_notes:
        read_notes = UserReadNotes(pdf=pdf, user=request.user)
        read_notes.save()

        update_user_points(request, 4)
        update_user_coins(request, 8)

        message_title = "Started to read notes!"
        points_up = 4
        coins_up = 8

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    user_data = user_info(request)

    update_user_last_location(request, 'notes', topic)

    context = {
        'topic': topic,
        'video': videos[0].key,
        'pdf': pdf,
        'user_data': user_data,
        'message_title': message_title,
        'points_up': points_up,
        'coins_up': coins_up
    }
    return render(request, 'pages/notes.html', context)


@login_required
def quiz(request):
    # Initializing points update message
    message_title = None
    points_up = None
    coins_up = None
    danger_message = None

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # default values of context variables
    submitted_question = None
    user_answer = None

    # if user submits a answer
    if request.method == 'POST':
        # retreive question and user data
        user_id = request.POST['user_id']
        question_number = request.POST['question_number']
        user_answer = int(request.POST['radio'])

        # Fetch question submitted by user
        submitted_question = Question.objects.get(id=question_number)

        # check if user has previously submitted the question
        if request.user.is_authenticated:
            current_user = request.user
            already_attempted_question = UserAttemptedQuestion.objects.filter(
                question=submitted_question, user=current_user)

        # when user is attempting question again
        if already_attempted_question:
            if (user_answer == submitted_question.answer):
                if already_attempted_question[0].isCorrect:
                    message_title = "Correct Answer!"
                else:
                    already_attempted_question[0].isCorrect = True
                    already_attempted_question[0].save()
                    update_user_points(request, 1)
                    update_user_coins(request, 2)
                    message_title = "Correct answer!"
                    points_up = 1
                    coins_up = 2
            else:
                danger_message = "Incorrect answer!"
        # when user is attempting the question for first time
        else:
            if (user_answer == submitted_question.answer):
                attemptedQuestion = UserAttemptedQuestion(
                    question=submitted_question, user=request.user, isCorrect=True)
                attemptedQuestion.save()
                update_user_points(request, 1)
                update_user_coins(request, 2)
                message_title = "Correct answer!"
                points_up = 1
                coins_up = 2
            else:
                attemptedQuestion = UserAttemptedQuestion(
                    question=submitted_question, user=request.user, isCorrect=False)
                attemptedQuestion.save()
                danger_message = "Incorrect answer!"

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Fetching all the questions of current topic
    questions = Question.objects.filter(topic=topic)

    # allow only one question to display on each page
    paginator = Paginator(questions, 1)
    page = request.GET.get('page')
    paged_questions = paginator.get_page(page)

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    user_data = user_info(request)

    update_user_last_location(request, 'quiz', topic)

    context = {
        'topic': topic,
        'questions': paged_questions,
        'submitted_question': submitted_question,
        'video': videos[0].key,
        'user_answer': user_answer,
        'user_data': user_data,
        'message_title': message_title,
        'points_up': points_up,
        'coins_up': coins_up,
        'danger_message': danger_message
    }

    return render(request, 'pages/quiz.html', context)


@login_required
def questions(request):

    user_data = user_info(request)
    
    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # if user posts a question
    if 'question' in request.POST:
        question = request.POST['question']
        details = request.POST['details']
        query = Query(topic=topic, user=request.user,
                      question=question, details=details)
        query.save()

    # list of all the questions of current topic
    questions = Query.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'questions': questions,
        'user_data': user_data
    }

    return render(request, 'pages/questions.html', context)


@login_required
def question(request):

    user_data = user_info(request)

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # current question/query
    if 'questionID' in request.GET:
        questionID = request.GET['questionID']

    query = Query.objects.get(id=questionID)

    # if user posts a comment
    if 'comment' in request.POST:
        comment = request.POST['comment']
        new_comment = Comment(user=request.user, query=query, comment=comment)
        new_comment.save()

    # list of all the comments of current topic
    comments = Comment.objects.filter(query=query)

    context = {
        'topic': topic,
        'query': query,
        'comments': comments,
        'user_data': user_data
    }

    return render(request, 'pages/question.html', context)




@login_required
def challenges(request):
    # pop message
    message_title = None

    if 'dp' in request.GET:
        challenge_id = request.GET['dp']
        # challenge 
        dp_challenge = Challenge.objects.get(id=challenge_id)
        # check if chip is already baught
        dp_already_baught = DoublePoint.objects.filter(challenge=dp_challenge, user=request.user)

        if not dp_already_baught:
            double_point = DoublePoint(challenge=dp_challenge, user=request.user)
            double_point.save()
            update_user_coins(request, -32)
            message_title = "Chip Activated!"

    if 'fw' in request.GET:
        challenge_id = request.GET['fw']
        # challenge 
        fw_challenge = Challenge.objects.get(id=challenge_id)
        # check if chip is already baught
        fw_already_baught = FreeWin.objects.filter(challenge=fw_challenge, user=request.user)

        if not fw_already_baught:
            free_win = FreeWin(challenge=fw_challenge, user=request.user)
            free_win.save()
            update_user_coins(request, -24)
            message_title = "Chip Activated!"

    user_all_dp = DoublePoint.objects.filter(user=request.user)

    dp_challenge_list = []
    
    for user_dp in user_all_dp:
        dp_challenge_list.append(user_dp.challenge)

    user_all_fw = FreeWin.objects.filter(user=request.user)

    fw_challenge_list = []
    
    for user_fw in user_all_fw:
        fw_challenge_list.append(user_fw.challenge)


    user_data = user_info(request)

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Fetch easy challenges
    easy_challenges = Challenge.objects.filter(topic=topic, difficulty="easy")

    # Fetch medium challenges
    medium_challenges = Challenge.objects.filter(topic=topic, difficulty="medium")

    # Fetch hard challenges
    hard_challenges = Challenge.objects.filter(topic=topic, difficulty="hard")

    update_user_last_location(request, 'challenges', topic)

    context = {
        'topic': topic,
        'easy_challenges': easy_challenges,
        'medium_challenges': medium_challenges,
        'hard_challenges': hard_challenges,
        'user_data': user_data,
        'message_title': message_title,
        'dp_challenge_list': dp_challenge_list,
        'fw_challenge_list': fw_challenge_list
    }

    return render(request, 'pages/challenges.html', context)


def hint(request):
    # current user's total coins
    userCoins = TotalCoins.objects.get(user=request.user)
    total_coins = userCoins.coins

    # retreive challenge id
    if 'challenge_id' in request.POST:
        challenge_id = int(request.POST['challenge_id'])
    else:
        return JsonResponse({'error': 'no challenge_id'})

    # retreive coins
    if 'coins' in request.POST:
        coins = int(request.POST['coins'])
        if coins > total_coins:
            return JsonResponse({'error': 'Not enough coins'})
        if coins > 0:
            coins = coins * (-1)
    else:
        return JsonResponse({'error': 'no coins'})
    
    challenge = Challenge.objects.get(id=challenge_id)

    # check if user has already used any hint for that question
    pre_hint = Hint.objects.filter(challenge=challenge, user=request.user)

    # if hint exists
    if pre_hint:
        hint = Hint.objects.get(challenge=challenge, user=request.user)
        hint.hints_baught = hint.hints_baught + 1
        hint.save()
        update_user_coins(request, coins)
        hint_number = hint.hints_baught
    else:
        hint = Hint(challenge=challenge, user=request.user)
        hint.save()
        update_user_coins(request, coins)
        hint_number = 1

    return JsonResponse({'total_coins': total_coins+coins, 'hint_number': hint_number})

@login_required
def challenge(request):
    
    # data related to user: coins, points, rank
    user_data = user_info(request)

    # get current topic name
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # get current challenge id
    if 'exercise' in request.GET:
        exercise = request.GET['exercise']
    else:
        return redirect('topics')


    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Current challenge
    challenge = Challenge.objects.get(topic=topic, id=exercise)

    # get hints bought for this challenge
    hint = Hint.objects.get(challenge=challenge, user=request.user)

    context = {
        'challenge': challenge,
        'user_data': user_data,
        'hint': hint,
    }

    return render(request, 'pages/code_editor.html', context)

def result(request):
    return render(request, 'pages/result.html')